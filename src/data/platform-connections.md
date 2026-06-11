# ProPro - Platform Connection Guide
# Full credential and setup requirements for all 44+ trading platforms
# Source: TradeZella documentation (help.tradezella.com)

---

## BROKER SYNC (API Auto-Connect)

### 1. MetaTrader 4 (MT4)
- **Credentials**: Login number (6-10 digits) + Investor Password
- **How to get**: MT4 Mailbox tab -> broker emails with investor password
- **Setup**: Add Account -> MT4 -> Select broker -> Enter login + investor password -> Connect
- **Note**: Investor password preferred over regular password

### 2. MetaTrader 5 (MT5)
- **Credentials**: Login number (6-10 digits) + Investor Password
- **Setup**: Add Account -> MT5 -> Select broker -> Enter login + investor password -> Connect

### 3. Tradovate
- **Credentials**: Username + Password (+ 2FA if enabled)
- **Setup**: Add Account -> Tradovate -> Auto Sync -> Select Live/Demo -> Enter credentials -> 2FA
- **Note**: Commissions NOT included. Toggle Live/Demo if account doesn't appear.

### 4. TradingView
- **Credentials**: Username + Password (OAuth)
- **Setup**: Add Account -> TradingView -> Auto Sync -> Connect -> Enter credentials -> Authorize

### 5. cTrader
- **Credentials**: Account credentials (OAuth popup)
- **Setup**: Add Account -> cTrader -> Auto Sync -> Connect -> Enter credentials -> Accept -> Select accounts

### 6. NinjaTrader
- **Credentials**: Account credentials (+ 2FA)
- **Setup**: Add Account -> NinjaTrader -> Auto Sync -> Select Live/Demo -> Connect -> Tradovate popup -> Credentials -> 2FA
- **Note**: Uses Tradovate API under the hood

### 7. Interactive Brokers (IBKR)
- **Credentials**: Flex Token + Activity Flex Query ID
- **Get Flex Token**: IB Web Portal -> Performance & Reports -> Flex Queries -> Settings gear -> Generate token (1-year)
- **Get Query ID**: Create Flex Query -> Trades -> Executions -> All -> CSV -> Last 365 Days
- **Date format**: yyyy-MM-dd | Time: HH:mm:ss
- **Note**: 24hr delay for same-day trades

### 8. Charles Schwab (ThinkorSwim)
- **Credentials**: Account username/password (OAuth)
- **Setup**: Add Account -> Charles Schwab -> Auto Sync -> Connect -> Enter credentials -> Accept -> Select accounts
- **Note**: Refresh token expires every 6-7 days. 60-day data limit.

### 9. Robinhood
- **Credentials**: Username + Password + 2FA
- **Setup**: Add Account -> Robinhood -> Auto Sync -> Connect -> Enter credentials -> 2FA -> Authorize

### 10. TradeStation
- **Credentials**: Account credentials + 2FA
- **Setup**: Add Account -> TradeStation -> Auto Sync -> Connect -> Enter credentials -> 2FA
- **Note**: 90 days history only. Simulated/demo accounts NOT supported.

### 11. Webull
- **Credentials**: Account credentials + 2FA
- **Setup**: Add Account -> Webull -> Auto Sync -> Connect -> Enter credentials -> 2FA -> Authorize
- **Note**: US only. Stocks & Options only.

### 12. ByBit
- **Credentials**: API Key + API Secret (Read-Only)
- **Get Key**: ByBit web -> Profile -> API -> Create New Key -> System-generated -> Read-Only -> No IP Restriction
- **Setup**: Add Account -> ByBit -> Auto Sync -> Mainnet/Demo -> Paste API Key & Secret -> Connect
- **Note**: WEB only (not mobile). Secret shown once.

### 13. TopstepX
- **Credentials**: Username + API Key (ProjectX API subscription required)
- **Setup**: Add Account -> TopstepX -> Auto Sync -> Enter Username & API Key -> Connect
- **Note**: Requires active ProjectX subscription

### 14. DXtrade
- **Credentials**: Server name/URL + account credentials
- **Setup**: Add Account -> DXtrade -> Auto Sync -> Select server (or paste URL) -> Enter credentials -> Connect
- **Note**: If server not listed, paste web URL

### 15. TradeLocker
- **Credentials**: Account credentials (OAuth)
- **Setup**: Add Account -> TradeLocker -> Auto Sync -> Connect -> Agree

### 16. IronBeam
- **Credentials**: Account ID (8 digits) + API Key (from support)
- **Get Key**: Email mike.murphy@ironbeam.com or alex.berov@ironbeam.com
- **Setup**: Add Account -> IronBeam -> Auto Sync -> Live/Demo -> Account ID & API Key -> Connect
- **Note**: No self-serve API key. Same-day trades only.

### 17. Coinbase
- **Credentials**: API Key Name + Private Key (CDP API Key, View only)
- **Get Key**: Coinbase -> Advanced Trade API -> Create New API Key -> Permission: View -> Leave IP blank
- **Setup**: Add Account -> Coinbase -> Auto Sync -> Paste API Key Name & Private Key -> Connect
- **Note**: Private Key shown only once.

### 18. OANDA
- **Credentials**: Personal API Key (from OANDA Hub)
- **Get Key**: hub.oanda.com -> Trading Tools -> OANDA API -> Generate
- **Setup**: Add Account -> OANDA -> Auto Sync -> Live/Demo -> Paste API Key -> Connect -> Select accounts
- **Note**: API key shown only once.

### 19. Power E-Trade -> COMING SOON
### 20. eToro -> COMING SOON
### 21. Alpaca -> COMING SOON

---

## FILE UPLOAD (Manual CSV Import)

### 22. DAS Trader Pro -> Export: Trades window -> Config -> Columns: Time, Symb, Side, Price, Qty, Route, Broker, Account, Type, Cloid -> CSV
### 23. Sierra Chart -> Export: Trade Activity Log -> File -> Export CSV
### 24. TastyTrade -> Export: Account -> History -> Export CSV
### 25. ThinkorSwim -> Export: Monitor -> Activity & Positions -> Export CSV
### 26. FTMO -> Export: Client Area -> MetriX -> Trading Journal -> Export CSV
### 27. Lightspeed -> Export: Reports -> Trade History -> Export CSV
### 28. Match-Trader -> Export: History -> Export CSV
### 29. Rithmic R Trader -> Export: Trading Activity -> Export CSV
### 30. Sterling Trader Pro -> Export: Reports -> Trade History -> Export CSV
### 31. TradeZero -> Export: Account -> History -> Export CSV
### 32. Silexx -> Export: Reports -> Trade Log -> Export CSV
### 33. EdgeProX -> Export: Reports -> Trade History -> Export CSV
### 34. MotiveWave -> Export: Trade Manager -> Export CSV
### 35. CQG Desktop -> Export: Orders Filled tab -> 3 dots -> Download -> XLSX
### 36. ATAS -> Export: Statistics -> History -> Executions -> Export -> XLSX
### 37. Questrade -> Export: Account -> History -> Export CSV
### 38. Zerodha -> COMING SOON
### 39. Tradier -> COMING SOON
### 40. LSEG -> Export: Reports -> Trade History -> Export CSV
### 41. TEFS Evolution -> Export: Trade History -> Export CSV
### 42. TC2000 -> Export: Account -> Trades -> Export CSV
### 43. Quantower -> Export: Logs -> Trade History -> Export CSV
### 44. Bookmap -> Export: Trade History -> Export CSV
### 45. Alpha Ticks -> Export: Reports -> Export CSV
### 46. TD Direct Investing -> Export: Account -> History -> Export CSV
### 47. TD Direct Investment -> Export: Trade History -> Export CSV
