import { Readable } from 'node:stream'

import { Request, Response } from 'express'

import { log } from './logger'

export async function proxy(uri: string, req: Request, res: Response) {
  const handleError = (e: string) => {
    res.status(500).end(`error proxying to "${uri}: ${e}`)
  }

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (key === 'referer' || value == null) {
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item)
      }
    } else {
      headers.set(key, value)
    }
  }

  const jolokiaAuthorization = req.headers['x-jolokia-authorization']
  if (jolokiaAuthorization) {
    headers.set('authorization', Array.isArray(jolokiaAuthorization) ? jolokiaAuthorization[0] : jolokiaAuthorization)
  }

  try {
    const request: RequestInit & { duplex?: 'half' } = {
      method: req.method,
      headers,
    }

    if (req.method === 'POST') {
      // can we pass the request to be streamed from incoming expres.js to outgoing fetch request?
      if (req.complete || req.readableEnded) {
        // pass data consumed and transformed into JSON by bodyParser.json() middleware
        request.body = JSON.stringify(req.body ?? {})
      } else {
        // we can safely stream
        request.body = req as unknown as BodyInit
        request.duplex = 'half'
      }
    }

    const res2 = await fetch(uri, request)
    const contentType = res2.headers.get('content-type')
    if (contentType) {
      res.header('content-type', contentType)
    }

    const newHeaders: Record<string, string> = {}
    res2.headers.forEach((v, k) => {
      newHeaders[k] = v
    })
    if (res2.status == 401 && newHeaders['www-authenticate']) {
      // emulate Hawtio's probing of remote Jolokia. Without "WWW-Authenticate: Basic ...",
      // browser never displays native credentials dialog, so we can handle it nicer
      let v = newHeaders['www-authenticate']
      if (v.toLowerCase().startsWith('basic')) {
        v = 'Hawtio original-scheme="Basic" ' + v.substring(6, v.length)
        newHeaders['WWW-Authenticate'] = v
      }
    }

    switch (res2.status) {
      case 401:
      case 403:
      case 429:
        log.info('Authentication failed on remote server:', res2.status, res2.statusText, uri)
        log.debug('Response headers:', newHeaders)
        res.header(newHeaders).sendStatus(res2.status)
        break
      default:
        if (!res2.ok) {
          handleError(`${res2.status} ${res2.statusText}`)
          return
        }
        if (res2.body) {
          res.status(res2.status)
          Readable.fromWeb(res2.body as import('node:stream/web').ReadableStream)
            .pipe(res)
            .on('error', handleError)
        } else {
          res.status(res2.status).end()
        }
    }
  } catch (error) {
    handleError(String(error))
  }
}
