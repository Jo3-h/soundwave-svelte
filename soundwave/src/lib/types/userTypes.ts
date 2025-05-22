import { type Post, type Comment, type Like, type User } from '$lib/server/db/schema';

export type UserPreview = Pick<User, 'id' | 'username' | 'profilePicture'>;

export type LikeDetail = Like & {
	user: UserPreview;
};

export type CommentDetail = Comment & {
	user: UserPreview;
	likes: LikeDetail[];
};

export type PostDetail = Post & {
	user: UserPreview;
	likes: LikeDetail[];
	comments: CommentDetail[];
};
