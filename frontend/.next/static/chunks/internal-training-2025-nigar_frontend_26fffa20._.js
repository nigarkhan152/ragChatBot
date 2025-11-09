(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/internal-training-2025-nigar/frontend/src/app/auth/success/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthSuccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/internal-training-2025-nigar/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/internal-training-2025-nigar/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/internal-training-2025-nigar/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function AuthSuccess() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthSuccess.useEffect": ()=>{
            const token = searchParams.get("token");
            const username = searchParams.get("user");
            if (token && username) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({
                    username
                }));
                router.push("/ask/".concat(username));
            }
        }
    }["AuthSuccess.useEffect"], [
        router,
        searchParams
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-white",
        children: "Logging you in..."
    }, void 0, false, {
        fileName: "[project]/internal-training-2025-nigar/frontend/src/app/auth/success/page.js",
        lineNumber: 20,
        columnNumber: 10
    }, this);
}
_s(AuthSuccess, "8i1PHtDhDf9NMpKTkROQKKwA/RI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$internal$2d$training$2d$2025$2d$nigar$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = AuthSuccess;
var _c;
__turbopack_context__.k.register(_c, "AuthSuccess");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/internal-training-2025-nigar/frontend/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/internal-training-2025-nigar/frontend/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=internal-training-2025-nigar_frontend_26fffa20._.js.map