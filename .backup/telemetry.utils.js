(function (root) {
    const TELEMETRY_KEY = 'smartws_telemetry_v1';
    const TELEMETRY_MAX_EVENTS = 120;

    function readTelemetryState(storage = root?.localStorage) {
        try {
            const raw = storage?.getItem?.(TELEMETRY_KEY);
            if (!raw) return { counts: {}, events: [], lastUpdatedAt: 0 };
            const parsed = JSON.parse(raw);
            return {
                counts: parsed && typeof parsed.counts === 'object' ? parsed.counts : {},
                events: Array.isArray(parsed?.events) ? parsed.events : [],
                lastUpdatedAt: Number(parsed?.lastUpdatedAt) || 0,
            };
        } catch {
            return { counts: {}, events: [], lastUpdatedAt: 0 };
        }
    }

    function writeTelemetryState(state, storage = root?.localStorage) {
        try {
            storage?.setItem?.(TELEMETRY_KEY, JSON.stringify(state));
        } catch {
            return;
        }
    }

    function trackTelemetry(eventName, payload = {}, options = {}) {
        if (!eventName) return;
        const storage = options?.storage || root?.localStorage;
        const now = typeof options?.now === 'function' ? options.now : () => Date.now();
        const state = readTelemetryState(storage);
        state.counts[eventName] = (state.counts[eventName] || 0) + 1;
        state.events.push({
            event: eventName,
            at: now(),
            payload: payload && typeof payload === 'object' ? payload : {},
        });
        if (state.events.length > TELEMETRY_MAX_EVENTS) {
            state.events.splice(0, state.events.length - TELEMETRY_MAX_EVENTS);
        }
        state.lastUpdatedAt = now();
        writeTelemetryState(state, storage);
    }

    function getTelemetrySnapshot(storage = root?.localStorage) {
        return readTelemetryState(storage);
    }

    function clearTelemetryState(storage = root?.localStorage) {
        writeTelemetryState({ counts: {}, events: [], lastUpdatedAt: Date.now() }, storage);
    }

    function initGlobalErrorTelemetry(options = {}) {
        const scope = options?.scope || root;
        if (!scope || typeof scope.addEventListener !== 'function') return false;
        if (scope.__SMARTWS_TELEMETRY_ERROR_HOOKED__) return true;

        const notify = typeof options?.notify === 'function'
            ? options.notify
            : (message) => {
                if (typeof scope?.showToast === 'function') scope.showToast(message);
            };

        scope.addEventListener('error', (event) => {
            trackTelemetry('global_runtime_error', {
                message: String(event?.message || 'unknown-error'),
                source: String(event?.filename || 'unknown-source'),
                line: Number(event?.lineno) || 0,
                column: Number(event?.colno) || 0,
            }, { storage: scope?.localStorage });
            notify('⚠️ ระบบพบข้อผิดพลาด โปรดบันทึกงานและลองใหม่');
        });

        scope.addEventListener('unhandledrejection', (event) => {
            const reason = event?.reason;
            trackTelemetry('global_unhandled_rejection', {
                message: String(reason?.message || reason || 'unknown-rejection'),
            }, { storage: scope?.localStorage });
            notify('⚠️ ระบบพบข้อผิดพลาดระหว่างประมวลผล โปรดบันทึกงานและลองใหม่');
        });

        scope.__SMARTWS_TELEMETRY_ERROR_HOOKED__ = true;
        return true;
    }

    const api = {
        TELEMETRY_KEY,
        TELEMETRY_MAX_EVENTS,
        readTelemetryState,
        writeTelemetryState,
        trackTelemetry,
        getTelemetrySnapshot,
        clearTelemetryState,
        initGlobalErrorTelemetry,
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
        return;
    }

    root.SMARTWS_TELEMETRY_UTILS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
