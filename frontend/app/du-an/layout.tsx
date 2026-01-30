import { metadata as projectsMetadata } from '../projects/layout';

export const metadata = projectsMetadata;

export default function ProjectsAliasLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return children;
}
