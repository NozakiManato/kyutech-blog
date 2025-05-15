import { requireAuth } from "@/lib/auth";
import { BlogClient } from "@/components/blog/blog-client";

const BlogPage = async () => {
  const { profile } = await requireAuth();
  if (!profile) {
    return <div>プロフィールが見つかりません</div>;
  }
  return <BlogClient profile={profile} />;
};

export default BlogPage;
