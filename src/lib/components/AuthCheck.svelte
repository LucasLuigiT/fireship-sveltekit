<script lang="ts">
  import { user } from "$lib/firebase";
  function redirectToLogin() {
    window.location.href = "/login";
  }
</script>

{#if $user}
  <slot />
{:else}
  <p>You must be logged in to view this page.</p>
  <a href="/login" on:click|preventDefault={redirectToLogin}>Log in</a>
{/if}
