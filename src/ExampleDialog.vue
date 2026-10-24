<script setup>
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui'
</script>

<template>
  <DialogRoot>
    <DialogTrigger data-testid="open-dialog">Open dialog</DialogTrigger>
    <!-- Put content beside the routed page so hideOthers captures that page element. -->
    <DialogPortal to="#app">
      <DialogOverlay class="overlay" />
      <DialogContent class="dialog">
        <DialogTitle>Example dialog</DialogTitle>
        <DialogDescription>Close this dialog, then navigate to Page B.</DialogDescription>
        <DialogClose data-testid="close-dialog">Close dialog</DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
