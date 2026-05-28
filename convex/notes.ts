import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

const colorValidator = v.union(
	v.literal('yellow'),
	v.literal('blue'),
	v.literal('green'),
	v.literal('pink'),
	v.literal('purple')
);

export const list = query({
	args: {},
	handler: async (ctx) => ctx.db.query('guestbookNotes').order('desc').collect()
});

export const add = mutation({
	args: { x: v.number(), y: v.number(), color: colorValidator },
	handler: async (ctx, args) => ctx.db.insert('guestbookNotes', { ...args, content: '' })
});

export const updatePosition = mutation({
	args: { id: v.id('guestbookNotes'), x: v.number(), y: v.number() },
	handler: async (ctx, { id, x, y }) => ctx.db.patch(id, { x, y })
});

export const updateColor = mutation({
	args: { id: v.id('guestbookNotes'), color: colorValidator },
	handler: async (ctx, { id, color }) => ctx.db.patch(id, { color })
});

export const updateContent = mutation({
	args: { id: v.id('guestbookNotes'), content: v.string() },
	handler: async (ctx, { id, content }) => ctx.db.patch(id, { content })
});

export const remove = mutation({
	args: { id: v.id('guestbookNotes') },
	handler: async (ctx, { id }) => ctx.db.delete(id)
});
