import CategoryDetailPage from '../../categories/[slug]/page';

interface CategoryPageProps {
 params: Promise<{ slug: string }>;
}

export default function CategoryDetailAliasPage({ params }: CategoryPageProps) {
 return <CategoryDetailPage params={params} />;
}
