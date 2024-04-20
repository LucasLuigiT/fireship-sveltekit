<script lang="ts">
  import { auth, user } from "$lib/firebase";
  import { Stepper, Step } from "@skeletonlabs/skeleton";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    console.log(user);
  }

  let isUserLoggedIn = false;
  $: isUserLoggedIn = $user ? true : false;
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
      (content)
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
