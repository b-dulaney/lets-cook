import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6">
          There was a problem signing you in. This could be because:
        </p>
        <ul className="text-gray-600 text-left mb-6 space-y-2">
          <li>• The sign-in link has expired</li>
          <li>• The sign-in was cancelled</li>
          <li>• There was a problem with the authentication provider</li>
        </ul>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
