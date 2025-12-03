import type { ComponentId } from '@/core'
import { useBuilder } from '@/hooks/use-builder'
import React from 'react'
import { Button } from './ui/button'
import { GripHorizontalIcon } from 'lucide-react'

interface ComponentWrapperProps {
    componentId: ComponentId
    children: React.ReactNode
}
export function ComponentWrapper({ componentId, children }: ComponentWrapperProps) {
    const { state } = useBuilder()
    const componentNode = state[componentId]
    return (
        <div className="border p-4 rounded-lg flex items-start gap-4">
            <Button size="icon-sm" variant="outline" className='shrink-0'>
                <GripHorizontalIcon />
            </Button>
            <div className='flex-1'>
                {children}
            </div>
        </div>
    )
}
