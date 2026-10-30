export interface Reference {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  palette: string[];
  fonts: string[];
  summary: string;
  takeaway: string;
  /** Imagen de portada/mockup opcional (ruta en /public o URL). Sin ella se genera un cover abstracto. */
  image?: string;
}
