//
// Simulates a Parent app that might embed hawtio/react

import React from 'react'
import { Link } from "react-router"
import {
  Masthead,
  MastheadMain,
  MastheadBrand,
  Button,
  Title,
  Alert,
  AlertActionCloseButton,
  Stack,
  StackItem,
  PageSection,
} from '@patternfly/react-core'
import './ParentShell.css'

//
export const ParentShell: React.FunctionComponent<{children: React.ReactNode }> = ({children}) => (
  <div className="parent-shell">
    <Masthead className="parent-shell-masthead">
      <MastheadMain>
        <MastheadBrand>
          🔷 PARENT SHELL
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
    <div className="parent-body">
      {children}
    </div>
    <footer className="parent-shell-footer">
      <p>🔷 Hawtio Console is embedded within the Parent Shell</p>
    </footer>
  </div>
)

export const ParentHome: React.FC = () => {
  return (
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h1">Parent Shell Home</Title>
        </StackItem>
        <StackItem>
          <p>This simulates the Parent Shell before clicking on Hawtio.</p>
        </StackItem>
        <StackItem>
          <Link to="/hawtio" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              Open Hawtio Console →
            </Button>
          </Link>
        </StackItem>
        <StackItem>
          <Alert variant="warning" title="Expected Behavior">
            <ul>
              <li>Clicking the button navigates to <code>/embedded/app/hawtio</code></li>
              <li>Hawtio component will load</li>
              <li>This demonstrates the embedding scenario</li>
            </ul>
          </Alert>
        </StackItem>
      </Stack>
    </PageSection>
  )
}
