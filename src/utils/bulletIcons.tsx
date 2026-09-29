import React from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';

/**
 * Shared keyword -> icon mapping used across every generated-slide layout
 * component so bullet/feature accents look consistent deck-wide.
 */
const BULLET_ICON_KEYWORDS: Array<[RegExp, React.ElementType]> = [
    [/\b(grow|growth|scale|increas|revenue|sales|market)\b/i, TrendingUpIcon],
    [/\b(idea|innovat|creativ|design|concept)\b/i, LightbulbIcon],
    [/\b(fast|speed|quick|efficien|instant|rapid|performance)\b/i, SpeedIcon],
    [/\b(team|people|user|customer|community|collab|audience)\b/i, GroupsIcon],
    [/\b(secur|safe|protect|trust|privacy|reliab|complian)\b/i, ShieldIcon],
    [/\b(smart|ai|automat|intelligen)\b/i, AutoAwesomeIcon],
    [/\b(global|world|region|countr|internation)\b/i, PublicIcon],
    [/\b(cost|price|budget|\$|roi|profit|fund)\b/i, AttachMoneyIcon],
    [/\b(build|develop|engineer|tool|infrastructur)\b/i, BuildIcon],
    [/\b(time|schedul|deadline|timeline|roadmap)\b/i, ScheduleIcon],
    [/\b(love|care|passion|mission|value)\b/i, FavoriteIcon],
    [/\b(award|win|best|top|leader|success)\b/i, EmojiEventsIcon],
    [/\b(data|metric|analyt|stat|number|percent)\b/i, BarChartIcon],
];

export const getBulletIcon = (text: string, fallbackIndex = 0): React.ElementType => {
    const match = BULLET_ICON_KEYWORDS.find(([re]) => re.test(text || ''));
    if (match) return match[1];
    const fallbacks = [CheckCircleIcon, AutoAwesomeIcon, TrendingUpIcon, ShieldIcon];
    return fallbacks[fallbackIndex % fallbacks.length];
};
