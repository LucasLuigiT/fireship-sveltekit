<script lang="ts">
  import { auth, db, user } from "$lib/firebase";
  import { Stepper, Step } from "@skeletonlabs/skeleton";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { doc, getDoc, writeBatch } from "firebase/firestore";

  let isUserLoggedIn = false;
  $: isUserLoggedIn = $user ? true : false;

  let username = "";
  let loading = false;
  let isAvailable = false;
  let debounceTimer: NodeJS.Timeout;

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    console.log(user);
  }

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

<div class="flex justify-center items-center h-screen">
  <Stepper>
    <Step locked={!isUserLoggedIn}>
      <svelte:fragment slot="header">Sign In</svelte:fragment>
      {#if $user}
        <h2>Welcome, {$user.displayName?.split(" ")[0]}.</h2>
        <button
          class="btn bg-warning-500 text-surface-500 hover:bg-warning-400 hover:text-surface-600 w-full"
          on:click={() => signOut(auth)}
        >
          Sign out
        </button>
      {:else}
        <button
          class="btn bg-surface-300 text-surface-500 hover:bg-surface-400 hover:text-surface-600 w-full"
          on:click={signInWithGoogle}
        >
          Sign in with Google
        </button>
      {/if}
    </Step>
    <Step>
      <svelte:fragment slot="header">Username</svelte:fragment>
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
    </Step>
    <Step>
      <svelte:fragment slot="header">Photo</svelte:fragment>
      (content)
    </Step>
  </Stepper>
</div>

<main>
  <div>
    <slot />
  </div>
</main>
