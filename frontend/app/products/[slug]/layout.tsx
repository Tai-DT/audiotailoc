import { ReactNode } from 'react';
import { generateMetadata } from './metadata';

export { generateMetadata };

export default function ProductDetailLayout ( { children }: { children: ReactNode } )
{
 return <>{children}</>;
}
