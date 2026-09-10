import test from "node:test";
import assert from "node:assert/strict";
import { sendContact } from "../src/lib/contact.ts";
const message = {
  name: " Example Visitor ",
  email: " visitor@example.com ",
  message: " Portfolio test ",
};
test("sends trimmed content to the existing endpoint and requests JSON", async () => {
  let called = 0;
  await sendContact(message, async (url, options) => {
    called++;
    assert.equal(url, "https://formspree.io/f/mzdlepvr");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Accept, "application/json");
    assert.deepEqual(JSON.parse(options.body), {
      name: "Example Visitor",
      email: "visitor@example.com",
      message: "Portfolio test",
    });
    return new Response("{}", { status: 200 });
  });
  assert.equal(called, 1);
});
test("rejects empty, malformed, and oversized fields before any request", async () => {
  for (const invalid of [
    { ...message, name: " " },
    { ...message, email: "bad-address" },
    { ...message, message: " " },
    { ...message, message: "x".repeat(5001) },
  ])
    await assert.rejects(
      sendContact(invalid, async () => {
        assert.fail("must not send invalid content");
      }),
      /Please check/,
    );
});
test("does not report success for a provider error", async () => {
  await assert.rejects(
    sendContact(message, async () => new Response("{}", { status: 429 })),
    /Delivery was not confirmed/,
  );
});
test("propagates network failures so the form can preserve the message", async () => {
  await assert.rejects(
    sendContact(message, async () => {
      throw new Error("offline");
    }),
    /offline/,
  );
});
test("aborts stalled delivery", async () => {
  await assert.rejects(
    sendContact(
      message,
      async (_, options) =>
        new Promise((resolve, reject) => {
          options.signal.addEventListener(
            "abort",
            () => reject(new Error("aborted")),
            { once: true },
          );
        }),
      20,
    ),
    /aborted/,
  );
});
