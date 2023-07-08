export {}

declare global {
  function html2pdf(...args: any): any

  interface Window {
    html2pdf: any
  }
}
