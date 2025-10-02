import Link from 'next/link';
import { getAllPosts, PostMetadata } from '@/lib/posts';

export default async function BlogPage() {
  const posts: PostMetadata[] = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">我的 Markdown 博客</h1>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <Link href={`/blog/${post.id}`}>
              <h2 className="text-2xl font-semibold hover:text-blue-600">{post.title}</h2>
            </Link>

            <div className="text-gray-600 mt-2">
              <span>作者：{post.author}</span> ·
              <span> 日期：{new Date(post.date).toLocaleDateString()}</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}