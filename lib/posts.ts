// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 定义文章元数据类型（TypeScript 类型约束）
export type PostMetadata = {
  id: string;
  title: string;
  date: string;
  author: string;
  tags?: string[]; // 可选标签字段
};

// 定义完整文章类型（包含正文）
export type Post = PostMetadata & {
  content: string;
};

// MD 文件存放路径
const postsDir = path.join(process.cwd(), 'content/posts');

// 确保目录存在（首次运行自动创建）
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// 获取所有文章的元数据（用于列表页）
export function getAllPosts(): PostMetadata[] {
  // 读取目录下所有 MD 文件
  const fileNames = fs.readdirSync(postsDir).filter(name => name.endsWith('.md'));
  
  const posts = fileNames.map(fileName => {
    // 提取 ID（文件名去掉 .md 后缀）
    const id = fileName.replace(/\.md$/, '');
    // 读取文件内容
    const fullPath = path.join(postsDir, fileName);
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    // 解析 MD 头部元数据（title、date 等）
    const { data } = matter(fileContent);
    
    // 类型校验（确保元数据格式正确）
    if (typeof data.title !== 'string' || typeof data.date !== 'string' || typeof data.author !== 'string') {
      throw new Error(`Invalid metadata in ${fileName}`);
    }
    
    return {
      id,
      title: data.title,
      date: data.date,
      author: data.author,
      tags: data.tags as string[] | undefined, // 可选标签
    };
  });
  
  // 按日期排序（最新的在前）
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 根据 ID 获取单篇文章（用于详情页）
export function getPostById(id: string): Post {
  const fullPath = path.join(postsDir, `${id}.md`);
  // 检查文件是否存在
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post with id ${id} not found`);
  }
  // 读取并解析内容
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    id,
    title: data.title as string,
    date: data.date as string,
    author: data.author as string,
    tags: data.tags as string[] | undefined,
    content, // MD 正文内容
  };
}