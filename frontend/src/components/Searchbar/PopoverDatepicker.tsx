import {Button, Popover} from '@mantine/core';
import {DatePicker} from "@mantine/dates";
import '@mantine/dates/styles.css';
import {useState} from "react";


const PopoverDatepicker = () => {

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const formatDateRange = () => {
        const [start, end] = dateRange;
        if (!start || !end) return "Select vacation period";

        // Format dates as DD.MM.YYYY
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        return `${formatDate(start)} - ${formatDate(end)}`;
    };


    return (
        <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
            <Popover.Target>
                <Button>{formatDateRange()}</Button>
            </Popover.Target>
            <Popover.Dropdown>
                <DatePicker
                    type="range"
                    value={dateRange}
                    onChange={setDateRange}
                    minDate={new Date()}
                    numberOfColumns={1}
                    allowSingleDateInRange
                />
            </Popover.Dropdown>
        </Popover>
    );
}

export default PopoverDatepicker;