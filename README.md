# DevEvent Platform

A production-ready full-stack event discovery and management platform built with Next.js, React, Tailwind CSS, MongoDB, and Cloudinary.

## Tech Stack

- **Frontend / Framework:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend / Database:** Next.js Route Handlers, Server Actions, MongoDB, Mongoose
- **Storage & Analytics:** Cloudinary API, PostHog

## Acknowledgements & Credits

**Original Project Tutorial:** Built following the full-stack Next.js course by [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) ([Watch on YouTube](https://youtu.be/I1V9YWqRIeI?is=HKm7kqmsmMy4Xaz-)).

## Key Improvements & Refactoring (Beyond the Tutorial)

### 1. API Architecture & Request Handling

- **Flexible Payload Processing:** Refactored POST route handlers to conditionally parse both binary image file streams (`multipart/form-data`) and string URLs via `formData`.
- **PowerShell & CLI Compatibility:** Normalized array parameters (`tags`, `agenda`) to accept stringified JSON or multi-key values, resolving CLI parsing bugs in Windows terminal environments.

### 2. File Upload & Third-Party Integration

- **Stream-Based Cloudinary Uploads:** Integrated Node.js buffer streaming (`cloudinary.uploader.upload_stream`) for direct memory-to-cloud asset uploads without temporary local disk writes.
- **SSRF Network Compatibility:** Configured Next.js image optimization policies (`dangerouslyAllowLocalIP`) to resolve loopback and private IP asset fetching issues when running under corporate VPNs or local proxies.

### 3. Database Schema & Server Stability

- **Mongoose HMR Safety:** Applied model singleton guards (`models.Event || model('Event', EventSchema)`) to prevent `OverwriteModelError` during hot reloads in development.
- **Robust Exception Handling:** Enhanced API try-catch blocks with explicit status codes and error serialization to prevent unhandled runtime rejections.
