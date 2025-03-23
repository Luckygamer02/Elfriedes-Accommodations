"use client"
import { Timeline, Text } from '@mantine/core';

export default function uploadprogressbar({ activeStep }: { activeStep: number }){
    return(
      <Timeline active={activeStep} className="h-full w-1/3"  bulletSize={24}  >
          <Timeline.Item title="Location" >
            <Text>
                Default
            </Text>
          </Timeline.Item>
          <Timeline.Item title="Basic Information">

          </Timeline.Item>
          <Timeline.Item title="Image Upload">

          </Timeline.Item>
          <Timeline.Item title="Extras">

          </Timeline.Item>
      </Timeline>
    );
}