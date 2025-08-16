import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        50: string
        100: string
        200: string
        300: string
        500: string
        600: string
        700: string
        900: string
      }
      gray: {
        50: string
        100: string
        200: string
        300: string
        400: string
        500: string
        600: string
        700: string
        800: string
        900: string
      }
      success: {
        50: string
        500: string
        700: string
      }
      warning: {
        50: string
        500: string
        700: string
      }
      error: {
        50: string
        500: string
        700: string
      }
    }
    breakpoints: {
      sm: string
      md: string
      lg: string
      xl: string
    }
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
    }
    borderRadius: {
      sm: string
      md: string
      lg: string
      full: string
    }
    shadows: {
      sm: string
      md: string
      lg: string
    }
  }
}