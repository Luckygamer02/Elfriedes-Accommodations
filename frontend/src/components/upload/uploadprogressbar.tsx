"use client"
import { Timeline, Text } from '@mantine/core';

export default function uploadprogressbar(){
    return(
      <Timeline active={0} className="h-full w-1/3"  bulletSize={24}  >
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