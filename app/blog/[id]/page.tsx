// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getPostById, getAllPosts } from '@/lib/posts';
import Link from 'next/link';

// 强制该页面按请求动态渲染，确保新加入的 MD 文章可访问
export const dynamic = 'force-dynamic';

// 生成所有可能的动态路由（静态生成，提升性能）
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ id: post.id }));
}

// 服务器组件：根据 ID 展示文章详情
async function BlogPost({ params }: { params: { id: string } }) {
  try {
    const post = getPostById(params.id); // 获取文章详情
    return (
      <article className="max-w-4xl mx-auto p-6">
        {/* 返回列表页链接 */}
        <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← 返回博客列表
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        
        <div className="text-gray-600 mb-6">
          <span>作者：{post.author}</span> · 
          <span> 日期：{new Date(post.date).toLocaleDateString()}</span>
        </div>
        
        {/* 显示标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <hr className="mb-6" />
        
        {/* 渲染 Markdown 正文 */}
        <div className="prose max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    );
  } catch (error) {
    // 如果文章不存在，返回 404 页面
    return notFound();
  }
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  return <BlogPost params={params} />;
}