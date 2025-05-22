import { writable } from 'svelte/store';
import type { User } from '$lib/server/db/schema';

export const user = writable<User | null>(null);
