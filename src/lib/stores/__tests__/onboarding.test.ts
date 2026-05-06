/**
 * Copyright 2025 Assistance Micro Design
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';
import { onboardingStore } from '../onboarding';
import { ONBOARDING_STORAGE_KEY } from '$types/onboarding';

describe('onboardingStore', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
		onboardingStore.reset();
	});

	it('reads completion state from localStorage', () => {
		expect(onboardingStore.shouldShow()).toBe(true);

		localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');

		expect(onboardingStore.shouldShow()).toBe(false);
	});

	it('updates UI state even when localStorage setItem fails', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('storage blocked');
		});

		expect(() => onboardingStore.markComplete()).not.toThrow();
		expect(get(onboardingStore).completed).toBe(true);
	});

	it('falls back to showing onboarding when localStorage getItem fails', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('storage blocked');
		});

		expect(onboardingStore.shouldShow()).toBe(true);
	});

	it('resets UI state even when localStorage removeItem fails', () => {
		onboardingStore.markComplete();
		vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
			throw new Error('storage blocked');
		});

		expect(() => onboardingStore.reset()).not.toThrow();
		expect(get(onboardingStore).completed).toBe(false);
	});
});
