'use client'

import { Amplify  } from "aws-amplify"
import amplify_outputs from '../../../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from "@aws-amplify/ui-react"

Amplify.configure(amplify_outputs, {ssr: true})

const Auth = ({children}: {children: React.ReactNode}) => {
    return (
        <Authenticator.Provider>
            {children}
        </Authenticator.Provider>
    )
}
export default Auth
// This component is a placeholder for the authentication page.