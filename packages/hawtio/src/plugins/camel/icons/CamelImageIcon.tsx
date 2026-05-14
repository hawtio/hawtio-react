type CamelImageIconProps = {
  name: string
  svg: string
  size: number
}

const CamelImageIcon = (props: CamelImageIconProps) => {
  const { name, svg, size = 16 } = props
  // we need special syntax, as SVG icons are loaded now as base64 because of:
  //  - https://github.com/hawtio/hawtio-react/issues/2088
  //  - https://github.com/evanw/esbuild/issues/4045
  return <img src={`data:image/svg+xml;base64,${svg}`} width={size + 'px'} height={size + 'px'} alt={name} />
}

export { CamelImageIcon }
