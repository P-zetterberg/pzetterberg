import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const colorValidator = v.union(
	v.literal('yellow'),
	v.literal('blue'),
	v.literal('green'),
	v.literal('pink'),
	v.literal('purple')
);

export default defineSchema({
	guestbookNotes: defineTable({
		x: v.number(),
		y: v.number(),
		color: colorValidator,
		content: v.string()
	})
});
