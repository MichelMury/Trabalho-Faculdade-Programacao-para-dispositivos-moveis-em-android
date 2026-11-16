import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import type { Product } from '../data/products';

export function ProductArt({ product, height = 155 }: { product: Product; height?: number }) {
  return <Svg width="100%" height={height} viewBox="0 0 180 180" accessibilityRole="image" accessibilityLabel={`Ilustração de ${product.name}`}>
    <Circle cx="90" cy="86" r="67" fill="#FFF9F6" />
    <Ellipse cx="90" cy="158" rx="45" ry="5" fill="#EBDDE1" />
    <Path d="M86 24c-4-10 13-10 9 0-1 3-5 3-5 7L57 48h66L90 31" fill="none" stroke="#BEA38D" strokeWidth="2" />
    {product.category === 'Bodies' && <><Path d="m64 46-26 17 13 23 17-9-4 43 15 24h22l15-24-4-43 17 9 13-23-26-17-14 8H78Z" fill={product.color} stroke="#B9929F" strokeWidth="1.5" /><Path d="M78 48q12 25 25 0M64 118q17-4 19 25m33-25q-17-4-19 25" fill="none" stroke="#B9929F" strokeWidth="1.5" /><Path d="M81 84c-8-10-17 4 9 19 26-15 17-29 9-19l-9 6Z" fill="white" /></>}
    {product.category === 'Conjuntos' && <><Path d="m65 45-26 18 12 23 17-9-3 30h50l-3-30 17 9 12-23-26-18-14 8H79Z" fill={product.color} stroke="#93B9AC" strokeWidth="1.5" /><Path d="M79 46q11 20 22 0" stroke="#93B9AC" fill="none" strokeWidth="2" /><Path d="m65 114-6 32h27l4-20 4 20h27l-6-32Z" fill={product.color} stroke="#93B9AC" strokeWidth="1.5" /><Circle cx="90" cy="78" r="7" fill="white" /></>}
    {product.category === 'Vestidos' && <><Path d="m70 46-16 20 13 12 8-9-2 24-24 53q41 15 82 0l-24-53-2-24 8 9 13-12-16-20-10 8H80Z" fill={product.color} stroke="#AA92BA" strokeWidth="1.5" /><Path d="M80 48q10 20 20 0M73 93h34M76 101l-9 42m23-42v45m14-45 9 42" fill="none" stroke="#AA92BA" strokeWidth="1.5" /><Path d="m90 92-12-6v12l12-6 12-6v12Z" fill="white" /></>}
  </Svg>;
}
