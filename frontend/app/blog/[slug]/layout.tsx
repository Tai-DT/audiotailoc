import { ReactNode } from 'react';
import { generateMetadata } from './metadata';

export { generateMetadata };

export default function BlogDetailLayout ( { children }: { children: ReactNode } )
{
    return <>{children}</>;
}
