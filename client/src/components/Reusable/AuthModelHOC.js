import React, { useState } from 'react'
import { AUTH_POPUP_VARIANTS } from '../../constants/commonConstants'

const AuthModelHOC = (BaseComponent, setVariant, variant) => {
  return function WrappedAuthModelBaseComp(props) {

    const handlers = {
      switchToSignIn: () => {
        setVariant(AUTH_POPUP_VARIANTS.SIGNIN);
      },
      switchToRegister: () => setVariant(AUTH_POPUP_VARIANTS.REGISTER),
      switchToForgotPassword: () => setVariant(AUTH_POPUP_VARIANTS.FORGOT_PASSWORD),
    }

    return (
      <BaseComponent
        {...props}
        variant={variant}
        setVariant={setVariant}
        handlers={handlers}
      />
    )
  }
}

export default AuthModelHOC
