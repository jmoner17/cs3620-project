/**
 * @file layout.jsx
 * @brief Layout component for wrapping content for the Update Password page.
 */

/**
 * Metadata for the layout.
 * @var {Object} metadata
 * @property {string} title - The title of the Update Password page.
 * @property {string} description - A brief description of the Update Password page.
 */
export const metadata = {
    title: 'betterHealth - Update Password',
    description: 'BetterHealth Update Password Page',
  }
  
  /**
   * Layout component that wraps its children for the Update Password page.
   * 
   * @function Layout
   * @param {Object} props - React component props.
   * @param {ReactNode} props.children - The children components or content to be wrapped.
   * @returns {ReactNode} The children wrapped inside a React fragment.
   */
  export default function Layout({ children }) {
    return (
      <>
        {children}
      </>
    )
  }