"use client"
import {Text, Timeline} from '@mantine/core';

export default function uploadprogressbar({activeStep}: { activeStep: number }) {
    return (
        <Timeline active={activeStep - 1} className="h-full w-1/3" bulletSize={24}>
            <Timeline.Item title="Location">
                <Text>
                    Default
                </Text>
            </Timeline.Item>
            <Timeline.Item title="Basic Information">

            </Timeline.Item>
            <Timeline.Item title="Image Upload">

            </Timeline.Item>
            <Timeline.Item title="Features">

            </Timeline.Item>
            <Timeline.Item title="Features">

            </Timeline.Item>
            <Timeline.Item title="Discounts & Payed Extras">

            </Timeline.Item>
        </Timeline>
    );
}