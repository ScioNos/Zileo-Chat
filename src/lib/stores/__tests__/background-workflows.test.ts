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

import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { backgroundWorkflowsStore, runningCount } from '../background-workflows';
import { tauriListen } from '$lib/tauri';

vi.mock('$lib/tauri');

describe('backgroundWorkflowsStore lifecycle cleanup', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.mocked(tauriListen).mockResolvedValue(vi.fn());
		backgroundWorkflowsStore.destroy();
	});

	afterEach(() => {
		backgroundWorkflowsStore.destroy();
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('destroys synchronously and resets tracked executions', () => {
		backgroundWorkflowsStore.register('workflow-1', 'agent-1', 'Workflow 1');
		backgroundWorkflowsStore.setViewed('workflow-1');

		expect(get(runningCount)).toBe(1);
		expect(backgroundWorkflowsStore.getViewedWorkflowId()).toBe('workflow-1');

		const result = backgroundWorkflowsStore.destroy();

		expect(result).toBeUndefined();
		expect(get(runningCount)).toBe(0);
		expect(backgroundWorkflowsStore.getViewedWorkflowId()).toBeNull();
		expect(backgroundWorkflowsStore.getExecution('workflow-1')).toBeUndefined();
	});
});
