<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user } from "$lib/firebase";
  import { doc, getDoc, writeBatch } from "firebase/firestore";

  let username = "";
  let loading = false;
  let isAvailable = false;

  let debounceTimer: NodeJS.Timeout;

  async function checkAvailability() {
    clearTimeout(debounceTimer);
    isAvailable = false;
    loading = true;
    debounceTimer = setTimeout(async () => {
      console.log("Checking availability for", username);
      const ref = doc(db, "usernames", username);
      const exists = await getDoc(ref).then((doc) => doc.exists());
      isAvailable = !exists;
      loading = false;
    }, 500);
  }

  async function confirmUsername() {}
</script>

<AuthCheck>
  <h2>Choose a username</h2>
  <form on:submit|preventDefault={confirmUsername}>
    <input
      type="text"
      placeholder="username"
      bind:value={username}
      on:input={checkAvailability}
    />
    <p>{isAvailable ? "Available" : "Unavailable"}</p>
    <button type="submit" disabled={!isAvailable || loading}>
      {loading ? "Loading..." : "Choose"}
    </button>
  </form>
</AuthCheck>
