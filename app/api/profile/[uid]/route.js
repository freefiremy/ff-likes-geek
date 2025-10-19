export const dynamic = 'force-dynamic';

const INFO_BASE = Buffer.from('aHR0cDovLzIxNy4xNTQuMjM5LjIzOjEzOTg0Lw==', 'base64').toString('utf-8');
const INFO_PATH = Buffer.from('aW5mbz0=', 'base64').toString('utf-8');

export async function GET(_request, { params }) {
  const uid = params?.uid ?? '';

  if (!uid || !/^\d+$/.test(uid)) {
    return jsonResponse(
      {
        error: 'Invalid UID',
        message: 'The UID must contain digits only.',
      },
      400,
    );
  }

  const targetUrl = `${INFO_BASE}${INFO_PATH}${uid}`;

  try {
    const response = await fetch(targetUrl, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const payload = await response.text();
      return jsonResponse(
        {
          error: 'Upstream error',
          message: `Profile service returned ${response.status}`,
          payload,
        },
        response.status,
      );
    }

    const data = await response.json();
    return jsonResponse(data, 200);
  } catch (error) {
    return jsonResponse(
      {
        error: 'Profile lookup failed',
        message: error?.message ?? 'Unexpected error while contacting profile service.',
      },
      502,
    );
  }
}

const jsonResponse = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
