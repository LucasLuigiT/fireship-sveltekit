<script lang="ts">
  import { auth, user } from "$lib/firebase";
  import { signOut } from "firebase/auth";
  import type { PageData } from "./$types";
  import UserLink from "$lib/components/UserLink.svelte";

  export let data: PageData;

  async function signOutSSR(auth: any) {
    await fetch("/api/signin", { method: "DELETE" });
    await signOut(auth);
    window.location.href = "/loginNew";
  }
</script>

<svelte:head>
  <title>@{data.username} Links</title>
  <meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-8">
  <h1 class="text-7xl text-purple-500">
    @{data.username}
  </h1>

  <img
    src={data.photoURL ?? "/user.png"}
    alt="photoURL"
    width="256"
    class="mx-auto"
  />

  <p class="text-xl my-8">{data.bio ?? "no bio yet..."}</p>
  <ul class="list-none">
    {#each data.links as item}
      <UserLink {...item} />
    {/each}
  </ul>
  {#if $user}
    <button
      class="btn bg-warning-500 text-surface-500 hover:bg-warning-400 hover:text-surface-600 w-full"
      on:click={() => signOutSSR(auth)}
    >
      Sign out
    </button>
  {/if}
</main>
