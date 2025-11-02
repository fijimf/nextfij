import { redirect } from 'next/navigation';

export default function GamesPage() {
  // Get today's date in America/New_York timezone
  const today = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Parse and format as yyyymmdd
  const [month, day, year] = today.split('/');
  const formattedDate = `${year}${month}${day}`;

  // Redirect to /games/{date}
  redirect(`/games/${formattedDate}`);
}
