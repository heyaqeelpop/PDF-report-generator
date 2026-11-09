async function post(body) {
  const res = await fetch("http://localhost:3000/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  return { status: res.status, body: await res.json() };
}

async function main() {
  const both = await Promise.all([post(), post()]);
  console.log("Two rapid POSTs:", both);

  const forced = await post({ force: true });
  console.log("With force:", forced);
}

main();