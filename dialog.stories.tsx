import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { Button } from '../button';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Modal',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Modal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modal Title</DialogTitle>
          <DialogDescription>
            This is a description of the modal. You can put any content you want here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>This is the modal body.</p>
        </div>
        <DialogFooter>
          <Button type="submit">SaveChanges</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
