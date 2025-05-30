import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { getCalendar } from '../api/api';
import { motion } from 'framer-motion';

interface CalendarDay {
  date: string;
  day_num: number;
  phase: string;
  is_past: boolean;
  is_today: boolean;
  new_month: boolean;
  angle: number;
}

const Calendar: React.FC = () => {
  const [daysList, setDaysList] = useState<CalendarDay[]>([]);
  const bg = useColorModeValue('white', 'gray.700');
  const cellBg = useColorModeValue('gray.50', 'gray.600');

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await getCalendar();
        setDaysList(response.data.days_list);
      } catch (error) {
        console.error('Failed to fetch calendar', error);
      }
    };
    fetchCalendar();
  }, []);

  const phaseColors: { [key: string]: string } = {
    period: 'red.200',
    follicular: 'purple.200',
    fertile: 'yellow.200',
    ovulation: 'blue.200',
    luteal: 'indigo.200',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        maxW="4xl"
        mx="auto"
        mt={10}
        p={6}
        bg={bg}
        borderRadius="lg"
        boxShadow="lg"
        className="glow"
      >
        <VStack spacing={4}>
          <Grid
            templateColumns="repeat(7, 1fr)"
            gap={2}
            w="full"
            bg={cellBg}
            p={4}
            borderRadius="md"
          >
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <GridItem key={day} textAlign="center" fontWeight="bold">
                {day}
              </GridItem>
            ))}
            {daysList.map((day, index) => (
              <React.Fragment key={index}>
                {day.new_month && (
                  <GridItem
                    colSpan={7}
                    textAlign="center"
                    fontWeight="bold"
                    py={2}
                    bg="brand.50"
                  >
                    {new Date(day.date).toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </GridItem>
                )}
                <GridItem
                  textAlign="center"
                  bg={phaseColors[day.phase]}
                  p={2}
                  borderRadius="full"
                  className={day.is_today ? 'glow' : ''}
                  title={`Day ${day.day_num} — ${day.date}`}
                  opacity={day.is_past ? 0.6 : 1}
                  cursor="pointer"
                  _hover={{ transform: 'scale(1.1)', transition: '0.2s' }}
                >
                  {new Date(day.date).getDate()}
                </GridItem>
              </React.Fragment>
            ))}
          </Grid>
          <Box>
            <Text fontWeight="bold" mb={2}>
              Cycle Beads (Placeholder)
            </Text>
          </Box>
        </VStack>
      </Box>
    </motion.div>
  );
};

export default Calendar;