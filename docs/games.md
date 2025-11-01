# Games Functionality Specification

## Motivation
Displaying upcoming and historic basketball game results is one of the most important aspects of the site,
but the initial attempt at implementing a games page was underspecified and not implemented well.
This document specifies the functionality of the games page.

When implementing it might be necessary to remove, rewrite, or adapt the existing functionality.



## Endpoints

### `/games/{date}`

**Purpose**: Display all games for a specific date

**URL Parameters**:
* `date` - The date to display games for (format yyyymmdd)

**API Integration**:
* Backend API: `GET /api/games/{date}` format is yyyymmdd
* Response includes:
  - Requested date
  - Season information
  - Array of game objects
* Full API specification: http://localhost:8080/api/v3/api-docs
* Abbreviated schema:
```json
{
  "ApiResponseGamesByDateDTO": {
    "type": "object",
    "properties": {
      "result": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "data": {
        "$ref": "#/components/schemas/GamesByDateDTO"
      }
    }
  },
  "GamesByDateDTO": {
    "type": "object",
    "properties": {
      "season": {
        "type": "integer",
        "format": "int32"
      },
      "date": {
        "type": "string"
      },
      "games": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/GameDTO"
        }
      }
    }
  },
  "GameDTO": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "season": {
        "type": "integer",
        "format": "int32"
      },
      "date": {
        "type": "string",
        "format": "date"
      },
      "homeTeam": {
        "$ref": "#/components/schemas/TeamDTO"
      },
      "awayTeam": {
        "$ref": "#/components/schemas/TeamDTO"
      },
      "homeTeamSeed": {
        "type": "integer",
        "format": "int32"
      },
      "awayTeamSeed": {
        "type": "integer",
        "format": "int32"
      },
      "homeScore": {
        "type": "integer",
        "format": "int32"
      },
      "awayScore": {
        "type": "integer",
        "format": "int32"
      },
      "isNeutral": {
        "type": "boolean"
      },
      "conferenceGame": {
        "$ref": "#/components/schemas/ConferenceDTO"
      },
      "spread": {
        "type": "string"
      },
      "overUnder": {
        "type": "number",
        "format": "double"
      },
      "homeMoneyLine": {
        "type": "integer",
        "format": "int32"
      },
      "awayMoneyLine": {
        "type": "integer",
        "format": "int32"
      }
    }
  },
  "TeamDTO": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64"
      },
      "name": {
        "type": "string"
      },
      "longName": {
        "type": "string"
      },
      "nickname": {
        "type": "string"
      },
      "logoUrl": {
        "type": "string"
      },
      "primaryColor": {
        "type": "string"
      },
      "secondaryColor": {
        "type": "string"
      },
      "slug": {
        "type": "string"
      }
    },
    "ConferenceDTO": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64"
        },
        "name": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        }
      }
    }
  }
}
```

**Navigation**:
* URL should update when date changes (client-side navigation)
* Support browser back/forward navigation

**Error Handling**:
* Invalid date format → Show error message, default to today
* No games found → Display empty state with message
* API error → Show error message with retry option

### `/games`

**Purpose**: Default games landing page

**Behavior**:
* Automatically redirects to `/games/{date}` where date is "today"
* Uses server-side redirect (Next.js redirect)
* No API call needed

**Timezone**: Uses predetermined timezone (America/New_York)
## UI Components

### Page Header

**Display Elements**:
* Season (e.g., "2024-25 Season")
* Selected date (formatted as readable date, e.g., "Friday, November 1, 2024")

* **Navigation Controls**:
* Previous date button (◀ or similar)
* "Today" button (jumps to current date)
* Next date button (▶ or similar)
* Date picker component (allows selecting any date)

**Behavior**:
* Date change triggers:
  1. New API call to fetch games for selected date
  2. URL update (push state to `/games/{newDate}`)
  3. Loading state during fetch
* Navigation controls should be disabled during loading
* Browser back/forward should work correctly

### Games Table Filter
**Filter**
* Single unified text box which will filter games table by matching team name against team names.

### Games Table

**Layout**:
* Display games in a table format (desktop) or card layout (mobile)
* Compact, scannable design
* Style should be consistent with team page game lists

**Columns** (in order):


1. **Away Team**
   - Team name (clickable link to `/team/{teamId}`)
   - Team logo (optional)
   - Highlight if winner (subtle background color or bold)

2. **Away Score**
   - Score if available, otherwise "--"
   - Bold if winner

3. **Home Team**
   - Team name (clickable link to `/team/{teamId}`)
   - Team logo (optional)
   - Highlight if winner (subtle background color or bold)

4. **Home Score**
   - Score if available, otherwise "--"
   - Bold if winner

5. **Venue Indicator**
   - Icon or badge showing "N" for neutral site games
   - Empty for regular home games
   - This is NOT an editable checkbox, just a display indicator
   - May be null. Null will be treated as regular game.

7. **Conference**
   - Small icon of conference logo (URL should be in api data) if game is a conference game
   - Empty/null for non-conference games

8. **Betting Lines** (all may be null)
   - **Point Spread**: e.g., "Team -5.5"
   - **Over/Under**: e.g., "O/U 145.5"
   - **Money Lines**: Home ML / Away ML (e.g., "-150 / +130")
     - If game is complete: highlight winning side

9. **Actions**
   - Small icon button (e.g., info icon, arrow) to view game details
   - Links to game detail page (URL `/games/{gameId}`)

**Visual Styling**:

* **Winner highlighting**:
  - Subtle background color (e.g., very light green tint)
  - OR slightly bolder text weight
  - Should not be overly prominent

* **Betting outcome highlighting**:
  - Different subtle color for successful bet indicators (e.g., light blue)
  - Only show when game is complete AND betting line exists
  - Consider using small icons (✓ or ✗) next to the betting value

* **Row hover**: Subtle highlight on hover for better UX

**States**:

* **Loading**: Show skeleton loaders or loading spinner
* **Empty**: Display message "No games scheduled for this date"
* **Error**: Show error message with retry button

**Data Notes**:
* All fields except away/home team names may be null
* Betting lines are typically only available for certain games
* Conference indicator only applies to conference games

**Sorting** :
* Default sort: Order returned by API
* Should table is not sortable, but is filterable as described above.

## Expected API Response Schema

Example API responses are in the files docs/games_example1.json and docs/games_example2.json


## Technical Implementation Notes

### Framework & Libraries
* **Next.js 15**: Use App Router with dynamic route `[date]`
* **React Query**: For data fetching, caching, and state management
* **shadcn/ui**: Use Table, Button, DatePicker components
* **Tailwind CSS**: For styling and responsive design

### Component Structure (Suggested)
```
/src/app/games/
  page.tsx                    # Redirects to /games/[date] with today's date
  [date]/
    page.tsx                  # Main games page component
/src/components/games/
  GamesHeader.tsx             # Date navigation and season display
  GamesTable.tsx              # Games table component
  GameRow.tsx                 # Individual game row
  GameCell.tsx                # Reusable cell components
  BettingLineIndicator.tsx    # Betting outcome display
```

### Key Implementation Considerations

1. **Date Handling**:
   - Use `date-fns` or similar for date manipulation
   - Ensure consistent date format across URL, API, and display
   - Handle timezone conversions properly

2. **State Management**:
   - Use React Query for API data
   - Cache games data by date for better performance
   - Invalidate cache when needed

3. **Navigation**:
   - Use `useRouter` from next/navigation
   - Update URL without full page reload
   - Preserve scroll position when navigating back

4. **Responsive Design**:
   - Consider horizontal scroll for table on mobile
   - OR switch to card layout for mobile (requires design decision)
   - Hide less critical columns on smaller screens

5. **Performance**:
   - Lazy load game details if clicking through to detail page
   - Use React.memo for GameRow components if many games
   - Consider virtualization if showing 50+ games

6. **Accessibility**:
   - Proper semantic HTML (table vs div)
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Screen reader friendly betting outcome indicators

## Outstanding Decisions Required

Before implementation can begin, the following decisions must be made:

### Important (Should Have)
5. **Game detail page scope** - Implementation is outside the sope of this document
6. **Mobile responsive strategy** - Display table as cards on mobile
7. **Betting line display** - Scores and betting info are static and will not be refreshed on screen.
8. **Winner highlighting style** - Light green background and bolder text.

## Summary

This specification provides a comprehensive framework for implementing the games page, but requires several key decisions before development can begin. The most critical are:
