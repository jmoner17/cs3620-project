/**
 * @file layout.jsx
 * @brief Layout component for wrapping content.
 */

/**
 * @fn - Metadata for the layout.
 * @var {Object} metadata
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata = {
    title: 'BetterHealth - Account',
    description: 'BetterHealth Account Page',
  }
  
  /**
   * @function Layout - Layout component that wraps its children.
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