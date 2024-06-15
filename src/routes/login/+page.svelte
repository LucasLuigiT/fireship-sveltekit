<script lang="ts">
  import { auth, db, user, userData } from "$lib/firebase";
  import { Stepper, Step } from "@skeletonlabs/skeleton";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
  import { doc, getDoc, writeBatch } from "firebase/firestore";

  let isUserLoggedIn = false;
  $: isUserLoggedIn = $user ? true : false;
  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  $: isValid =
    username?.length > 2 && username.length < 16 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !isAvailable && !loading;

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

  async function confirmUsername() {
    console.log("Confirming username", username);
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), {
      username,
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: "Hello, world!",
      links: [
        {
          title: "GitHub",
          url: "https://github.com",
          icon: "github",
        },
      ],
    });
    await batch.commit();
    username = "";
    isAvailable = false;
  }
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
      {#if $userData?.username}
        <p>
          You already have a username: <strong>@{$userData.username}</strong>
        </p>
      {:else}
        <h2>Choose a username</h2>
        <form on:submit|preventDefault={confirmUsername}>
          <input
            type="text"
            placeholder="username"
            bind:value={username}
            on:input={checkAvailability}
            class:input-error={!isValid && isTouched}
            class:input-warning={isTaken}
            class:input-success={isAvailable && isValid && !loading}
          />
          <div class="my-4 min-h-16 px-8 w-full">
            {#if loading && isTouched && username.length > 0}
              <p class="text-secondary">
                Checking availability of @{username}...
              </p>
            {/if}

            {#if !isValid && isTouched && !loading}
              <p class="text-error text-sm">
                must be 3-16 characters long, alphanumeric only
              </p>
            {/if}

            {#if isValid && !isAvailable && !loading}
              <p class="text-warning text-sm">
                @{username} is not available
              </p>
            {/if}

            {#if isAvailable && isValid && !loading}
              <button class="btn btn-success"
                >Confirm username @{username}
              </button>
            {/if}
          </div>
        </form>
      {/if}
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
