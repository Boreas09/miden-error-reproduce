import { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function TestnetWarningModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check if user chose to not show warning again
    const dontShowAgain = localStorage.getItem('testnetWarningDontShow')
    if (dontShowAgain !== 'true') {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleDontShowAgain = () => {
    localStorage.setItem('testnetWarningDontShow', 'true')
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Testnet Warning</AlertDialogTitle>
          <AlertDialogDescription>
            This project is currently running on the testnet. Any transactions or data created here are for testing purposes only and do not represent real value.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDontShowAgain}>Don't Show Again</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}