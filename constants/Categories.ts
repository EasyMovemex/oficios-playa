export type Category = {
  slug: string;
  name: string;
  icon: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  { slug: 'plomeria', name: 'Plomería', icon: '🔧', description: 'Reparación de tuberías, fugas, instalaciones sanitarias' },
  { slug: 'electricidad', name: 'Electricidad', icon: '⚡', description: 'Instalaciones eléctricas, cableado, interruptores' },
  { slug: 'pintura', name: 'Pintura', icon: '🎨', description: 'Pintura interior y exterior, acabados decorativos' },
  { slug: 'jardineria', name: 'Jardinería', icon: '🌿', description: 'Poda, mantenimiento de jardines y áreas verdes' },
  { slug: 'albercas', name: 'Limpieza de Albercas', icon: '🏊', description: 'Mantenimiento y limpieza de piscinas' },
  { slug: 'limpieza', name: 'Limpieza del Hogar', icon: '🧹', description: 'Limpieza general, profunda y post-obra' },
  { slug: 'carpinteria', name: 'Carpintería', icon: '🪚', description: 'Muebles, closets, puertas, restauración' },
  { slug: 'cerrajeria', name: 'Cerrajería', icon: '🔑', description: 'Apertura, cambio y reparación de cerraduras' },
  { slug: 'gas', name: 'Gas y Gasodomésticos', icon: '🔥', description: 'Instalación y reparación de equipos de gas' },
  { slug: 'aire-acondicionado', name: 'Aire Acondicionado', icon: '❄️', description: 'Instalación, mantenimiento y reparación de minisplits' },
  { slug: 'albanileria', name: 'Albañilería', icon: '🧱', description: 'Construcción, remodelación, trabajos de concreto' },
  { slug: 'fumigacion', name: 'Fumigación', icon: '🪲', description: 'Control de plagas, cucarachas, termitas' },
  { slug: 'mudanzas', name: 'Mudanzas', icon: '📦', description: 'Carga, descarga y traslado de muebles' },
  { slug: 'herreria', name: 'Herrería', icon: '⚙️', description: 'Rejas, portones, estructuras metálicas' },
  { slug: 'impermeabilizacion', name: 'Impermeabilización', icon: '💧', description: 'Techos, azoteas, muros, impermeabilizante' },
];
