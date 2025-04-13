interface ArticlePageProps {
    params: { articleId: string };
}

export default function ArticlePage({ params }: ArticlePageProps) {
    const articleTitle = decodeURIComponent(params.articleId).replace(/-/g, ' ');

    return (
        <div>
            <h1>{articleTitle}</h1>
            <p>Hier könnte der Inhalt des Artikels stehen...</p>
        </div>
    );
}
