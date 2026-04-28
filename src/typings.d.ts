declare module 'pdfmake/build/pdfmake';
declare module 'pdfmake/build/vfs_fonts';
declare module 'pdfmake/interfaces' {
  export interface TDocumentDefinitions {
    content: any;
    [key: string]: any;
  }
}